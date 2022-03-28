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
                                    dbo.dn_fn_CalculaDistancia('" + p.latitud + @"','" + p.longitud + @"', [latitud],[longitud],'K') as distancia,
                                    (Select AVG(CAST(D2.resultadoDonacion as FLOAT)) from Donacion D2 where D2.ID_Usuario = N.ID_Usuario and D2.resultadoDonacion <> 0 group by D2.ID_Usuario) as 'PuntajeDonador'
                                FROM [WEBAPPDB].[dbo].[Necesidad] N
                                INNER JOIN Usuario U
                                ON U.Id = N.ID_Usuario
                                LEFT JOIN Persona P
                                ON P.ID_Usuario = U.ID
                                WHERE [ID_Estado] = 2 
                                AND N.[ID_Usuario] <> " + p.usuarioID +
                                @" AND NOT EXISTS(
                                                 SELECT * FROM [dbo].[Solicitud] S
                                                 WHERE S.Id_UsuarioEmisor = " + p.usuarioID +
                                                 @"AND S.Id_Necesidad = N.ID AND S.Id_Estado in (8,9))";

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

        [Route("api/necesidad/misnecesidades/{id}")]
        [HttpGet]
        public HttpResponseMessage GetMisNecesidades(int id)
        {
            string query = @"
                           SELECT N.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud],[direccion],[ID_Categoria],[estado]
                            ,[ID_Usuario] FROM
                            [WEBAPPDB].[dbo].[Necesidad] N
                            INNER JOIN [Estado] E ON E.ID = N.ID_Estado WHERE E.estado <> 'No Disponible' and [ID_Usuario] = " + id;
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
        [Route("api/necesidad/necesidadesRelacionadas")]
        public HttpResponseMessage PostNecesidadesRelacionadas(Relacion r)
        {
            string query = @"
                            
                           SELECT N.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud]
                                    ,[direccion],[ID_Categoria],[ID_Estado],N.[ID_Usuario],P.nombre, P.apellido,
                                    dbo.dn_fn_CalculaDistancia('" + r.latitud + @"','" + r.longitud + @"', [latitud],[longitud],'K') as distancia
                                    ,COUNT(1) as 'MatchLevel'
                            FROM [WEBAPPDB].[dbo].[Necesidad] N
                            INNER JOIN(
                                        SELECT Value FROM STRING_SPLIT('" + r.titulo + @"', ' ') where LEN(Value) > 3
                                       ) T ON N.Titulo like '%' + T.value + '%'
                            INNER JOIN Usuario U ON U.Id = N.ID_Usuario
                            LEFT JOIN Persona P ON P.ID_Usuario = U.ID
                            WHERE [ID_Estado] = 2 
                            AND NOT EXISTS (SELECT * FROM [WEBAPPDB].[dbo].[Solicitud] S WHERE S.[ID_Necesidad] = N.[ID] AND S.[ID_UsuarioEmisor] = " + r.usuarioID + @")
                            AND N.[ID_Usuario] <> " + r.usuarioID + @"
                             GROUP BY N.[ID], N.[fechaCreacion], N.[titulo], N.[descripcion], N.[latitud], N.[longitud], N.[direccion], N.[ID_Categoria], N.[ID_Estado], N.[ID_Usuario], P.Nombre, P.Apellido"
                            ;
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
