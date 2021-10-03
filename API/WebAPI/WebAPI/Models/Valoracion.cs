using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Valoracion   
    {
        public int ID { get; set; }
        public string fechaCreacion { get; set; }
        public int estrellas { get; set; }
        public int ID_Solicitud { get; set; }
        
    }
}