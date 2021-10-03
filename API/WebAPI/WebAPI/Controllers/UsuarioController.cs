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
    public class UsuarioController : ApiController
    {
        public HttpResponseMessage Post(Usuario U)
        {
            string query = @"
                           SELECT [ID],[nombreUsuario], [contrasenia] FROM [WEBAPPDB].[dbo].[Usuario] WHERE nombreUsuario = '"+ U.nombreUsuario + @"' AND contrasenia = '" + U.contrasenia + @"'";
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
