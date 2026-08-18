import { Telegraf, Markup } from 'telegraf';
import { AuthManager } from './authManager.js';
import { ADMIN_ID } from './storage.js';

export const BOT_TOKEN = '8959538358:AAGMI6t-BDxn-ozqXFTVMFGcunvURdgUAl0';
export const BOT_USERNAME = 'dsnhbgsdchjsdfuyhsdfgbot';
export const WEBAPP_URL = process.env.WEBAPP_URL || 'https://seka-myus.onrender.com';

let bot = null;

function createLaunchButton(label, url) {
  if (url.startsWith('https://')) {
    return Markup.button.webApp(label, url);
  }
  return Markup.button.url(label, url);
}

export function initTelegramBot() {
  bot = new Telegraf(BOT_TOKEN);

  // Pastki chap burchakdagi doimiy "O'ynash" tugmasini o'rnatish
  if (WEBAPP_URL.startsWith('https://')) {
    bot.telegram.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: '🎮 Seka O\'ynash',
        web_app: { url: WEBAPP_URL }
      }
    }).then(() => {
      console.log(`✅ Telegram Mini App menyu tugmasi o'rnatildi: ${WEBAPP_URL}`);
    }).catch(err => {
      console.warn('Telegram setChatMenuButton ogohlantirish:', err.message);
    });
  }

  // 1. /start buyrug'i (chuqur havola bilan: /start room_12345)
  bot.command('start', async (ctx) => {
    const from = ctx.from;
    if (!from) return;

    const user = AuthManager.registerOrGetUser(from);
    const userId = String(from.id);
    const isAdmin = AuthManager.isAdmin(userId);
    const payload = ctx.payload || ''; // masalan: "room_abc123"

    let appUrl = WEBAPP_URL;
    if (payload && payload.startsWith('room_')) {
      const roomId = payload.replace('room_', '');
      appUrl = `${WEBAPP_URL}#room=${roomId}`;
    }

    if (isAdmin) {
      return ctx.reply(
        `👑 *Xush kelibsiz, Bosh Admin!*\n\nSiz foydalanuvchilarni boshqarish, so'rovlarni tasdiqlash va ko'p o'yinchili Seka / Trinka o'yinida to'liq huquqlarga egasiz.\n\n💰 *Hisobingiz:* ${user.chips} chip`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [createLaunchButton('♠️ Seka O\'yinini Ochish', appUrl)],
            [Markup.button.callback('📋 Kutilayotgan So\'rovlar', 'admin_pending'), Markup.button.callback('👥 Foydalanuvchilar Statistikasi', 'admin_stats')]
          ])
        }
      );
    }

    if (user.status === 'approved') {
      return ctx.reply(
        `♠️♥️ *Seka / Trinka Online o'yiniga xush kelibsiz!* ♣️♦️\n\nSalom, *${user.firstName}*! Sizning hisobingiz faol.\n💰 *Hisobingiz:* ${user.chips} chip\n\nO'ynash yoki do'stlaringiz bilan stolga qo'shilish uchun pastdagi tugmani bosing!`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [createLaunchButton('🎮 Seka O\'ynash', appUrl)]
          ])
        }
      );
    }

    if (user.status === 'pending') {
      await ctx.reply(
        `⏳ *Ruxsat so'rovi kutilmoqda*\n\nSalom, *${user.firstName}*! Seka Online — yopiq klub o'yini.\n\nSizning ruxsat so'rovingiz adminga (*ID: ${ADMIN_ID}*) yuborildi. Ruxsat berilgach, sizga shu yerda avtomatik xabar keladi!`,
        { parse_mode: 'Markdown' }
      );

      // Adminga xabar yuborish
      notifyAdminNewRequest(user);
      return;
    }

    if (user.status === 'rejected' || user.isBanned) {
      return ctx.reply(
        `🚫 *Kirish taqiqlangan*\n\nSizning hisobingiz administrator tomonidan to'xtatilgan yoki rad etilgan. Yordam uchun adminga murojaat qiling.`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // 2. /admin buyrug'i
  bot.command('admin', async (ctx) => {
    const userId = String(ctx.from.id);
    if (!AuthManager.isAdmin(userId)) {
      return ctx.reply('⛔ Sizda admin buyruqlaridan foydalanish huquqi yo\'q.');
    }

    const pending = AuthManager.getPendingUsers();
    const all = AuthManager.getAllUsers();
    const adminUrl = `${WEBAPP_URL}#admin=true&uid=${userId}`;

    return ctx.reply(
      `📊 *Seka Admin Boshqaruv Markazi*\n\n` +
      `👥 Jami Foydalanuvchilar: *${all.length}*\n` +
      `⏳ Kutilayotgan So'rovlar: *${pending.length}*\n\n` +
      `Quyidagi amallardan birini tanlang:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [createLaunchButton('🛡️ Admin Panelni Ochish', adminUrl)],
          [Markup.button.callback(`📋 So'rovlarni Ko'rish (${pending.length})`, 'admin_pending')]
        ])
      }
    );
  });

  // 3. Tasdiqlash / Rad etish bo'yicha callbacklar
  bot.action(/^approve_(\d+)$/, async (ctx) => {
    if (!AuthManager.isAdmin(ctx.from.id)) {
      return ctx.answerCbQuery('Ruxsat yo\'q', { show_alert: true });
    }

    const targetId = ctx.match[1];
    const approved = AuthManager.approveUser(targetId);

    if (approved) {
      await ctx.answerCbQuery(`${approved.firstName} tasdiqlandi!`);
      await ctx.editMessageText(
        `✅ *Foydalanuvchiga ruxsat berildi:*\nIsm: *${approved.firstName}* (@${approved.username || 'username_yoq'})\nID: \`${approved.id}\`\nBerilgan chip: 1,000 chip.`,
        { parse_mode: 'Markdown' }
      );

      // Foydalanuvchiga xabar yuborish
      try {
        const userAppUrl = WEBAPP_URL;
        await bot.telegram.sendMessage(
          targetId,
          `🎉 *Tabriklaymiz, ${approved.firstName}!* \n\n*Seka / Trinka Online* o'yiniga kirishingiz Admin tomonidan tasdiqlandi!\n\n💰 Boshlang'ich hisobingiz: *1,000 chip*\n\nO'yinni boshlash uchun quyidagi tugmani bosing:`,
          {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
              [createLaunchButton('🎮 Seka O\'ynash', userAppUrl)]
            ])
          }
        );
      } catch (err) {
        console.warn(`Foydalanuvchiga xabar yuborilmadi ${targetId}:`, err.message);
      }
    }
  });

  bot.action(/^reject_(\d+)$/, async (ctx) => {
    if (!AuthManager.isAdmin(ctx.from.id)) {
      return ctx.answerCbQuery('Ruxsat yo\'q', { show_alert: true });
    }

    const targetId = ctx.match[1];
    const rejected = AuthManager.rejectUser(targetId);

    if (rejected) {
      await ctx.answerCbQuery(`${rejected.firstName} rad etildi`);
      await ctx.editMessageText(
        `❌ *Foydalanuvchi rad etildi:*\nIsm: *${rejected.firstName}* (@${rejected.username || 'username_yoq'})\nID: \`${rejected.id}\``,
        { parse_mode: 'Markdown' }
      );
    }
  });

  bot.action('admin_pending', async (ctx) => {
    if (!AuthManager.isAdmin(ctx.from.id)) return;
    const pending = AuthManager.getPendingUsers();

    if (pending.length === 0) {
      return ctx.editMessageText('✅ Hozircha kutilayotgan so\'rovlar yo\'q.');
    }

    for (const u of pending.slice(0, 5)) {
      await ctx.reply(
        `👤 *Yangi So'rov:*\nIsm: *${u.firstName}* (@${u.username || 'yo\'q'})\nID: \`${u.id}\`\nVaqt: ${new Date(u.createdAt).toLocaleTimeString()}`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback('✅ Ruxsat berish', `approve_${u.id}`),
              Markup.button.callback('❌ Rad etish', `reject_${u.id}`)
            ]
          ])
        }
      );
    }
  });

  bot.action('admin_stats', async (ctx) => {
    if (!AuthManager.isAdmin(ctx.from.id)) return;
    const all = AuthManager.getAllUsers();
    const approved = all.filter(u => u.status === 'approved').length;
    const pending = all.filter(u => u.status === 'pending').length;

    await ctx.reply(
      `📈 *Klub Statistikasi:*\n\n` +
      `• Jami Ro'yxatdan o'tganlar: *${all.length}*\n` +
      `• Faol O'yinchilar: *${approved}*\n` +
      `• Kutilayotganlar: *${pending}*`,
      { parse_mode: 'Markdown' }
    );
  });

  // Botni ishga tushirish
  bot.launch()
    .then(() => {
      console.log(`🤖 Telegram Bot @${BOT_USERNAME} faol va ishlayapti!`);
    })
    .catch((err) => {
      console.warn(`Telegram Bot ishga tushish ogohlantirish:`, err.message);
    });

  process.once('SIGINT', () => bot && bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot && bot.stop('SIGTERM'));

  return bot;
}

/**
 * Yangi so'rov bo'lganda Adminga bildirishnoma yuborish
 */
export async function notifyAdminNewRequest(user) {
  if (!bot) return;

  try {
    await bot.telegram.sendMessage(
      ADMIN_ID,
      `🔔 *Yangi Kirish So'rovi!*\n\n` +
      `👤 *Foydalanuvchi:* ${user.firstName} ${user.lastName || ''}\n` +
      `🔗 *Username:* @${user.username || 'yo\'q'}\n` +
      `🆔 *Telegram ID:* \`${user.id}\`\n` +
      `📅 *Sana:* ${new Date().toLocaleString()}\n\n` +
      `Amalni tanlang:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback('✅ Ruxsat berish', `approve_${user.id}`),
            Markup.button.callback('❌ Rad etish', `reject_${user.id}`)
          ]
        ])
      }
    );
  } catch (err) {
    console.warn('Adminga Telegram xabari yuborilmadi:', err.message);
  }
}
