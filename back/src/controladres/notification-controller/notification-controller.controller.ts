// notification.controller.ts
import { Controller, Get, Res, Post, Body, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller('notifications')
export class NotificationController {
    private clients = new Map<string, Response>();

    @Get('sse/:clientId')
    sse1(@Res() res: Response, @Param('clientId') clientId: string) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        this.clients.set(clientId, res);

        res.on('close', () => {
            this.clients.delete(clientId);
        });
    }

    @Post('send')
    sendNotification(@Body() data: { clientId: string, mensaje: string }) {
        const message = {
            remitente: data.clientId,
            mensaje: data.mensaje,
            hora: new Date().toLocaleTimeString()
        };

        this.clients.forEach((clientRes, id) => {
            if (id !== data.clientId) {
                clientRes.write(`data: ${JSON.stringify(message)}\n\n`);
            }
        });

        return { status: 'Notification sent' };
    }


    @Get('sse')
    sse(@Res() res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Enviar un evento cada segundo
        setInterval(() => {
            res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
        }, 1000);
    }
}
