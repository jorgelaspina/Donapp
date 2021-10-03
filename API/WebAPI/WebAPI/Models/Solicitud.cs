using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Solicitud
	{
		public int ID { get; set; }
		public string fechaCreacion { get; set; }
		public string tipoSolicitud { get; set; }
		public int ID_UsuarioEmisor { get; set; }	
		public int ID_Estado { get; set; }
		public int ID_Necesidad { get; set; }
		public int ID_Donacion { get; set; }
		public string fechaRespuesta { get; set; }
	}
}
