import { Schema, model, connect } from 'mongoose';
import ngrok from 'ngrok';
import 'dotenv/config'

(async () => {
      try {
            const servidorSchema = new Schema(
                  {
                        hostname: String,
                        port: Number,
                        hostport: String
                  }, {
                  timestamps: true,
            })
            const Servidor = model('Servidor', servidorSchema, 'Servidor')
            await connect(process.env.MONGODB_URL)
            const logEvent = (log) => console.log({ log })
            const statusChangeEvent = (status) => console.log({ status })
            const terminatedEvent = (terminated) => console.log({ terminated })
            const config = {
                  proto: 'tcp',
                  addr: 1883,
                  authtoken: process.env.NGROK_TOKEN,
                  onStatusChange: statusChangeEvent,
                  onLogEvent: logEvent,
                  onTerminated: terminatedEvent
            }
            const urlTunnel = await ngrok.connect(config);
            const url = new URL(urlTunnel);
            const { hostname, port } = url
            const hostport = `${hostname}:${port}`
            const servicio = new Servidor({ hostname, port, hostport })
            await servicio.save()
      } catch (e) {
            console.error(e)
      }
})()
