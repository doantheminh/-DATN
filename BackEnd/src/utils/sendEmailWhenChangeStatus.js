import { Resend } from 'resend';
const resend = new Resend('re_a2cJecgb_8nKZwJMgiZMBaL6LBckgdHBH');

export const sendEmailWhenChangeStatus = async (to, html) => {

    try {
        await resend.emails.send({
            from: 'Shop A-shirt <onboarding@resend.dev>',
            to: [to],
            subject: 'Shop A-Shirt thanks you very much',
            html
        });


    } catch (error) {
        console.error(error);
    }
}