import { Schema, model, connect } from 'mongoose';
import ngrok from 'ngrok';
import 'dotenv/config'

(async () => {
      try {
            const servidorSchema = new Schema(
                  {
                        hostname: String,
                        port: Number,
                        created_at: String,
                        hostport: String
                  }, {
                  timestamps: true,
            })
            const Servidor = model('Servidor', servidorSchema, 'Servidor')
            await connect(process.env.MONGODB_URL)
            const logEvent = (event) => console.log(event)
            const config = {
                  proto: 'tcp',
                  addr: 1883,
                  authtoken: process.env.NGROK_TOKEN,
                  onStatusChange: status => console.warn({ status }),
                  onLogEvent: event => logEvent(event),
                  onTerminated: terminated => console.warn({ terminated })
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
