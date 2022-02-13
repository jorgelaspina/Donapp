using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Usuario
    {
        public int ID { get; set; }
        public string nombreUsuario { get; set; }
        public string contrasenia { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public DateTime fechaNac { get; set; }
        public int DNI { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }
}