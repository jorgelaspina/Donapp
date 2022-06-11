using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    public class NotificacionController : ApiController
    {
        [Route("api/misnotificaciones/{id}")]
    [HttpGet]
    public HttpResponseMessage MisNotificaciones(int id)
        {
            string query = @" SELECT * FROM [WEBAPPDB].[dbo].[Notificaciones] WHERE ID_Usuario = "+id + @" order by fechaCreacion desc";
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager.
                ConnectionStrings["WEBAPPDB"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                da.Fill(table);
            }
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }
        public string Post(Notificacion n)
        {
            string query = @"insert into dbo.Notificacion SELECT GETDATE(), '" +
                n.titulo + @"','" +
                n.mensaje + @"', 0," +
                n.ID_Usuario + @"," +
                n.ID_Emisor + @"," +
                n.ID_Solicitud + @"," +
                n.ID_Donacion + @"," +
                n.ID_Necesidad;
            try
            {
                DataTable table = new DataTable();
                using (var con = new SqlConnection(ConfigurationManager.
                    ConnectionStrings["WEBAPPDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                using (var da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.Text;
                    da.Fill(table);
                }
                return "Notificacion creada";
            }
            catch (Exception)
            {
                return query;
            }
        }

    }
}
