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
    public class NecesidadController : ApiController
    {
        [Route("api/necesidad/necesidadescercanas")]

        public HttpResponseMessage Post(Posicion p)
        {
            string query = @"
                           SELECT N.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud]
                                    ,[direccion],[ID_Categoria],[ID_Estado],N.[ID_Usuario],P.[nombre],P.[apellido],
                                    dbo.dn_fn_CalculaDistancia('" + p.latitud + @"','" +p.longitud + @"', [latitud],[longitud],'K') as distancia  
                                FROM [WEBAPPDB].[dbo].[Necesidad] N
                                INNER JOIN Usuario U
                                ON U.Id = N.ID_Usuario
                                LEFT JOIN Persona P
                                ON P.ID_Usuario = U.ID
                                WHERE N.[ID_Usuario] <> "+p.usuarioID;
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
        public string Post(Necesidad n)
        {
            string query = @"insert into dbo.Necesidad SELECT GETDATE(),'" +
                n.titulo + @"','" +
                n.descripcion + @"'," +
                n.latitud + @"," +
                n.longitud + @",'" +
                n.direccion + @"'," +
                n.ID_Categoria +
                @",(Select ID from dbo.Estado where estado = 'Disponible')," +
                n.ID_Usuario;
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
                return "Necesidad cargada";

            }
            catch (Exception)
            {
                return "Error al cargar necesidad";
            }
        }

        [Route("api/necesidad/misnecesidades")]
        public HttpResponseMessage PostMisDonaciones(Usuario U)
        {
            string query = @"
                           SELECT N.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud],[direccion],[ID_Categoria],[estado]
                            ,[ID_Usuario] FROM
                            [WEBAPPDB].[dbo].[Necesidad] N
                            INNER JOIN [Estado] E ON E.ID = N.ID_Estado WHERE E.estado <> 'No Disponible' and [ID_Usuario] = " + U.ID;
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
        [Route("api/necesidad/estado")]
        public HttpResponseMessage Post(Estado S)
        {
            string query = @"UPDATE Necesidad
                            SET ID_Estado = (SELECT ID From Estado where estado = '" + S.estado + @"') where ID = " + S.ID;
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
        public HttpResponseMessage delete(int ID)
        {
            string query = @"DELETE From Necesidad where Id = " + ID;
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
