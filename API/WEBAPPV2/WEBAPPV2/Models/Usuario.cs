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
    }
}