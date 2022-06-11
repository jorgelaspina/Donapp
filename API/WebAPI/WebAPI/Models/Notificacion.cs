using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Notificacion
    {
        public int ID { get; set; }
        public string fechaCreacion { get; set; }
        public string titulo { get; set; }
        public string mensaje { get; set; }
        public string leido { get; set; }
        public int ID_Usuario { get; set; }
        public int ID_Emisor { get; set; }
        public int ID_Solicitud { get; set; }
        public int ID_Donacion { get; set; }
        public int ID_Necesidad { get; set; }
    }
}
