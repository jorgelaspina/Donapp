using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Donacion
    {
		public int ID { get; set; }
		public string fechaCreacion { get; set; }
		public string titulo { get; set; }
		public string descripcion { get; set; }
		public decimal latitud { get; set; }
		public decimal longitud { get; set; }
		public int ID_Categoria { get; set; }
		public int ID_Estado { get; set; }
		public int ID_Usuario { get; set; }
		public int estrellasSegunDonante { get; set; }
		public int resultadoDonacion { get; set; }
    }
}