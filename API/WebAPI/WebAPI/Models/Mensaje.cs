using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Mensaje
    {
        public int ID { get; set; }
        public int ID_Conversacion { get; set; }
        public string fechaCreacion { get; set; }
        public string mensaje { get; set; }
        public string leido { get; set; }
        public int ID_UsuarioEmisor { get; set; }
    }
}