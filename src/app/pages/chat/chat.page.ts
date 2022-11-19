import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  mensajes : any;
  mensaje : any;
  mensajeEnviar: any = "";
  usuariosArray : any = [];
  usuarioActual : any;

  constructor(private chat:ChatService,public as : AuthService, public fs : FirestoreService, public push : PushService) { 
    this.mensajes = chat.items;
    console.log(this.mensajes);
    this.mensaje = {
      user: '',
      message: '',
      date: Date().toString(),
    }

    this.fs.traerUsuarios().subscribe((value) =>{
      this.usuariosArray = value;
      for (const iterator of this.usuariosArray) 
      {
        if(iterator.nombre == this.as.loggedUser.nombre)
        {
          this.usuarioActual = iterator;
          break;
        }
      }
    })
  }

  ngOnInit(){
    
  }

  sendMessage()
  {
    let hora = new Date();
    let consulta : any;
     

    this.mensaje.user = this.usuarioActual.nombre;
    this.mensaje.perfil = this.usuarioActual.perfil;
    this.mensaje.receptor = "";
    this.mensaje.message = this.mensajeEnviar;
    
    this.mensaje.date = hora.getHours() + ':' + hora.getMinutes();
    consulta = {
      nombre : this.usuarioActual.nombre,
      date : this.mensaje.date,
      mesa : this.usuarioActual.mesa
    }
    console.log(consulta);
    console.log(this.mensaje);
    this.chat.sendMessage(this.mensaje);
    this.sendPushMensaje();
    this.mensaje.message = '';
    this.mensajeEnviar = '';
    this.fs.agregarConsulta(consulta);

  }

  sendPushMensaje() 
  {
    this.push
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'ewFLpEGgSMqj0gNzBVjT6e:APA91bGXuBtj25lfwEy844VV2XjHhb8qVI2KAovOq3gr6hX5rCIjbM2ARQ7Ki2oYTohrQ-BN0wcv2UtyagFe7m1yj18DwM234Oj6XKorDmEkEgPvUR95b69YYtlJY7lDucXQRyj45qib',
        ],
        notification: {
          title: 'Nuevo mensaje.',
          body: 'Un cliente realizo una consulta.',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

}
