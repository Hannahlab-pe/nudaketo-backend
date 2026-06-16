import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const CHOCO = '#4B3527';
const GOLD = '#C2A45E';
const IVORY = '#F3EDDD';
const MUTED = '#9A8878';
const ARENA = '#D8C7A8';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private resendKey = process.env.RESEND_API_KEY || '';

  constructor() {
    if (this.resendKey) {
      this.logger.log('Correos vía Resend');
      return;
    }
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      });
    } else {
      this.logger.warn('Correos no configurados (ni RESEND_API_KEY ni SMTP)');
    }
  }

  private get from() {
    return process.env.MAIL_FROM || 'NUDA KETO <onboarding@resend.dev>';
  }

  private get site() {
    return process.env.FRONTEND_URL || 'https://www.nuda-keto.com';
  }

  private async send(to: string, subject: string, html: string) {
    try {
      if (this.resendKey) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from: this.from, to, subject, html }),
        });
        if (!res.ok) {
          this.logger.error(`Resend falló (${res.status}): ${await res.text()}`);
        }
        return;
      }
      if (this.transporter) {
        await this.transporter.sendMail({ from: this.from, to, subject, html });
      }
    } catch (err) {
      this.logger.error(`No se pudo enviar el correo a ${to}: ${err.message}`);
    }
  }

  private money(cents: number) {
    return `S/${(cents / 100).toFixed(2)}`;
  }

  private orderNo(order: any) {
    return order.id.slice(-6).toUpperCase();
  }

  private fmtDate(iso: any) {
    try {
      return new Date(iso).toLocaleString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return '';
    }
  }

  private itemsTable(order: any) {
    const rows = order.items
      .map(
        (i: any) =>
          `<tr>
            <td style="padding:10px 0;border-bottom:1px solid ${ARENA};color:${CHOCO};font-size:14px">
              <strong style="color:${GOLD}">${i.qty}×</strong> ${i.name}
              <span style="color:${MUTED};font-size:12px"> · ${i.sizeId}</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid ${ARENA};text-align:right;color:${CHOCO};font-size:14px;white-space:nowrap">${this.money(
              Math.round(i.price * 100) * i.qty,
            )}</td>
          </tr>`,
      )
      .join('');
    return `<table role="presentation" width="100%" style="border-collapse:collapse">${rows}</table>`;
  }

  private totalsBox(order: any) {
    const items = order.totalCents - (order.shippingCents || 0);
    return `
    <table role="presentation" width="100%" style="border-collapse:collapse;background:${IVORY};border-radius:12px;margin-top:16px">
      <tr><td style="padding:14px 16px 4px;color:${MUTED};font-size:13px">Productos</td><td style="padding:14px 16px 4px;text-align:right;color:${CHOCO};font-size:13px">${this.money(items)}</td></tr>
      <tr><td style="padding:4px 16px;color:${MUTED};font-size:13px">Envío</td><td style="padding:4px 16px;text-align:right;color:${CHOCO};font-size:13px">${order.shippingCents > 0 ? this.money(order.shippingCents) : 'Gratis'}</td></tr>
      <tr><td style="padding:8px 16px 14px;color:${CHOCO};font-weight:bold;font-size:16px;border-top:1px solid ${ARENA}">Total</td><td style="padding:8px 16px 14px;text-align:right;color:${CHOCO};font-weight:bold;font-size:18px;border-top:1px solid ${ARENA}">${this.money(order.totalCents)}</td></tr>
    </table>`;
  }

  private deliveryBox(order: any) {
    if (order.fulfillment === 'PICKUP') {
      return `
      <div style="margin-top:20px;padding:16px;border:1px solid ${ARENA};border-radius:12px">
        <p style="margin:0;color:${MUTED};font-size:11px;letter-spacing:2px">ENTREGA</p>
        <p style="margin:6px 0 0;color:${CHOCO};font-size:14px;font-weight:bold">Recojo en tienda</p>
        <p style="margin:4px 0 0;color:${MUTED};font-size:13px">Coordinaremos contigo el día y hora de recojo.</p>
      </div>`;
    }
    const dir = [order.address, order.district, order.city].filter(Boolean).join(', ');
    return `
    <div style="margin-top:20px;padding:16px;border:1px solid ${ARENA};border-radius:12px">
      <p style="margin:0;color:${MUTED};font-size:11px;letter-spacing:2px">ENVÍO A DOMICILIO</p>
      ${order.customerName ? `<p style="margin:6px 0 0;color:${CHOCO};font-size:14px;font-weight:bold">${order.customerName}${order.phone ? ` · ${order.phone}` : ''}</p>` : ''}
      <p style="margin:4px 0 0;color:${CHOCO};font-size:13px">${dir}</p>
      ${order.reference ? `<p style="margin:4px 0 0;color:${MUTED};font-size:12px">Ref: ${order.reference}</p>` : ''}
      ${order.mapsLink ? `<p style="margin:8px 0 0"><a href="${order.mapsLink}" style="color:${GOLD};font-size:13px;font-weight:bold;text-decoration:none">Ver ubicación en Google Maps →</a></p>` : ''}
    </div>`;
  }

  private button(href: string, label: string) {
    return `<a href="${href}" style="display:inline-block;background:${CHOCO};color:${IVORY};text-decoration:none;font-weight:bold;font-size:14px;padding:13px 30px;border-radius:999px">${label}</a>`;
  }

  private layout(opts: { badge: string; title: string; bodyHtml: string }) {
    return `
    <div style="background:${IVORY};padding:32px 12px;font-family:Arial,Helvetica,sans-serif">
      <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid ${ARENA}">
        <!-- Header -->
        <tr>
          <td style="background:${CHOCO};padding:30px 32px;text-align:center">
            <div style="font-family:Georgia,'Times New Roman',serif;color:${IVORY};font-size:26px;font-weight:bold;letter-spacing:3px">NUDA</div>
            <div style="color:${GOLD};font-size:11px;letter-spacing:6px;margin-top:2px">KETO</div>
          </td>
        </tr>
        <!-- Badge -->
        <tr>
          <td style="padding:0">
            <div style="background:${GOLD};color:${CHOCO};text-align:center;padding:9px;font-size:11px;letter-spacing:3px;font-weight:bold">${opts.badge}</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 18px;font-family:Georgia,serif;color:${CHOCO};font-size:24px">${opts.title}</h1>
            ${opts.bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid ${ARENA};text-align:center">
            <p style="margin:0;color:${MUTED};font-size:11px;letter-spacing:1px">NUDA KETO · Snacks keto premium</p>
            <p style="margin:4px 0 0;color:${ARENA};font-size:11px">Sin azúcar añadida · Gluten free · Lima, Perú</p>
          </td>
        </tr>
      </table>
    </div>`;
  }

  /** Confirmación al cliente */
  async sendOrderConfirmation(order: any) {
    const html = this.layout({
      badge: 'PEDIDO CONFIRMADO',
      title: '¡Gracias por tu compra!',
      bodyHtml: `
        <p style="margin:0 0 6px;color:${CHOCO};font-size:15px;line-height:1.6">Tu pedido fue registrado y tu pago confirmado. Te contactaremos pronto para coordinar la entrega.</p>
        <p style="margin:0 0 20px;color:${MUTED};font-size:13px">Pedido <strong style="color:${CHOCO}">#${this.orderNo(order)}</strong> · ${this.fmtDate(order.createdAt)}</p>
        <p style="margin:0 0 8px;color:${MUTED};font-size:11px;letter-spacing:2px">TU PEDIDO</p>
        ${this.itemsTable(order)}
        ${this.totalsBox(order)}
        ${this.deliveryBox(order)}
        <div style="text-align:center;margin-top:26px">${this.button(`${this.site}/mis-compras`, 'Ver mi pedido')}</div>
      `,
    });
    await this.send(order.email, `Tu pedido #${this.orderNo(order)} en NUDA KETO fue confirmado`, html);
  }

  /** Aviso de nuevo pedido a la dueña/admin */
  async sendAdminNotification(order: any) {
    const to = process.env.ADMIN_NOTIFY_EMAIL;
    if (!to) return;
    const html = this.layout({
      badge: 'NUEVO PEDIDO',
      title: `Nuevo pedido · ${this.money(order.totalCents)}`,
      bodyHtml: `
        <p style="margin:0 0 20px;color:${CHOCO};font-size:15px;line-height:1.6">Acabas de recibir un nuevo pedido. Estos son los detalles:</p>
        <div style="padding:14px 16px;border:1px solid ${ARENA};border-radius:12px;margin-bottom:18px">
          <p style="margin:0;color:${MUTED};font-size:11px;letter-spacing:2px">CLIENTE</p>
          <p style="margin:6px 0 0;color:${CHOCO};font-size:14px;font-weight:bold">${order.customerName || 'Cliente'}</p>
          <p style="margin:2px 0 0;color:${MUTED};font-size:13px">${order.email}${order.phone ? ` · ${order.phone}` : ''}</p>
        </div>
        <p style="margin:0 0 8px;color:${MUTED};font-size:11px;letter-spacing:2px">PRODUCTOS · Pedido #${this.orderNo(order)}</p>
        ${this.itemsTable(order)}
        ${this.totalsBox(order)}
        ${this.deliveryBox(order)}
        <div style="text-align:center;margin-top:26px">${this.button(`${this.site}/admin`, 'Ver en el panel')}</div>
      `,
    });
    await this.send(to, `Nuevo pedido #${this.orderNo(order)} — ${this.money(order.totalCents)}`, html);
  }
}
