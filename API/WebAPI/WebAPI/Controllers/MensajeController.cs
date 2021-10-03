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
    public class MensajeController : ApiController
    {
        public string Post(Mensaje m)
        {
            string query = @"insert into dbo.Mensaje SELECT GETDATE()," +
                m.ID_Conversacion + @", '" +
                m.mensaje + @"', 1," +
                m.ID_UsuarioEmisor;       
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
                return "Mensaje enviado";
            }
            catch (Exception)
            {
                return query;
            }
        }
        public HttpResponseMessage Get(int id)
        {
            string query = @" SELECT [ID],[fechaCreacion],[ID_Conversacion],[mensaje],[leido],[ID_UsuarioEmisor] FROM [WEBAPPDB].[dbo].[Mensaje] WHERE ID_Conversacion = "+id + @" order by fechaCreacion asc";
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

    }
}
