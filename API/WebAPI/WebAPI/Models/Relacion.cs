using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Relacion
    {
        public float latitud { get; set; }
        public float longitud { get; set; }
        public int usuarioID { get; set; }
        public string titulo { get; set; }
    }
}