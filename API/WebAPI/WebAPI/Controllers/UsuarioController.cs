using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class UsuarioController : ApiController
    {
        public HttpResponseMessage Post(Usuario U)
        {
            DataTable table = new DataTable();
            string query = @"
                           SELECT [ID],[nombreUsuario], [contrasenia] FROM [WEBAPPDB].[dbo].[Usuario] WHERE nombreUsuario = '" + U.nombreUsuario + @"' AND contrasenia = '" + U.contrasenia + @"'";
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
        public HttpResponseMessage GetUsuario(int ID)
        {
            try
            {
                
                var data = new DataTable();
                string procedureName = "[dbo].[getUsuario]";
                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["WEBAPPDB"].ConnectionString))
                using (SqlCommand cmd2 = new SqlCommand(procedureName, con))
                {
                    cmd2.CommandType = CommandType.StoredProcedure;
                    cmd2.Parameters.Add(new SqlParameter("@ID_Usuario", ID));
                    con.Open();
                    var dataReader = cmd2.ExecuteReader();
                    data.Load(dataReader);
                    return Request.CreateResponse(HttpStatusCode.OK, data);
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, e.Message);
            }
        }

        [Route("api/usuario/editarUsuario")]
         public string PostEditarUsuario(Usuario U)
        {
            try
            {
                var data = new DataTable();
                string procedureName = "[dbo].[editUsuario]";
                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["WEBAPPDB"].ConnectionString))
                using (SqlCommand cmd2 = new SqlCommand(procedureName, con))
                {
                    cmd2.CommandType = CommandType.StoredProcedure;
                    cmd2.Parameters.Add(new SqlParameter("@fechaNac", U.fechaNac));
                    cmd2.Parameters.Add(new SqlParameter("@telefono", U.telefono));
                    cmd2.Parameters.Add(new SqlParameter("@email", U.email));
                    cmd2.Parameters.Add(new SqlParameter("@contrasenia", U.contrasenia));
                    cmd2.Parameters.Add(new SqlParameter("@id", U.ID));
                    con.Open();
                    cmd2.ExecuteNonQuery();
                }
                return "Usuario actualizado";
            }
            catch (Exception e)
            {
                return "Error al actualizar usuario: " + e.Message;
            }
        }
        [Route("api/usuario/guardarImagen")]
        public string guardarImagen()
        {
            string filename="";
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                filename = postedFile.FileName;
                var physicalPath = HttpContext.Current.Server.MapPath("~/fotosPerfil/" + filename);

                postedFile.SaveAs(physicalPath);
                return filename;               
            }
            catch (Exception e)
            {
                return "error loading profile picture: " +e.Message + ". FileName= " + filename;
            }
        }
    }
}
