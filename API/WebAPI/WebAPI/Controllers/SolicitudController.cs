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
    public class SolicitudController : ApiController
    {
        public HttpResponseMessage Get()
        {
            string query = @"
                           SELECT * FROM
                            [WEBAPPDB].[dbo].[Solicitud]";
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
        public string Post(Solicitud s)
        {
            string query = @"insert into dbo.Solicitud SELECT GETDATE(),'" +
                s.tipoSolicitud + @"'," +
                s.ID_UsuarioEmisor + @", (Select ID from Estado where estado = 'Pendiente'), " +
                s.ID_Necesidad + @"," +
                s.ID_Donacion +  @", NULL";
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
                return "Solicitud generada correctamente";
            }
            catch (Exception)
            {
                return query;
            }
        }
        [Route("api/Solicitud/solicitudesrecibidas")]
        public HttpResponseMessage PostSolicitudesRecibidas(Usuario U)
        {
            string query = @"
                           SELECT S.ID
                          ,U.nombreUsuario
                          ,D.titulo
	                      ,CAST(CAST(S.fechaCreacion AS DATE) AS VARCHAR) as 'fechaCreacion'
	                      ,D.direccion
                          ,E.estado
                          ,S.ID_Donacion
                          ,S.ID_Necesidad
                          ,'solicitudDonacion' as tipoSolicitud                            
                        FROM [WEBAPPDB].[dbo].[Solicitud] S
                        INNER JOIN [dbo].[Donacion] D
                        ON S.ID_Donacion = D.ID
                        INNER JOIN [dbo].[Usuario] U 
                        ON S.Id_UsuarioEmisor = U.ID
                        INNER JOIN [dbo].[Estado] E
                        ON E.ID = S.ID_Estado
                        WHERE D.[ID_Usuario] = " + U.ID +
                        @" UNION 
                        SELECT S.ID
                          ,U.nombreUsuario
                          ,N.titulo
	                      ,CAST(CAST(S.fechaCreacion AS DATE) AS VARCHAR) as 'fechaCreacion'
	                      ,N.direccion
                          ,E.estado
                          ,S.ID_Donacion
                          ,S.ID_Necesidad
                          ,'ofrecimientoDonacion' as tipoSolicitud
                        FROM[WEBAPPDB].[dbo].[Solicitud] S
                        INNER JOIN [dbo].[Necesidad] N
                        ON N.ID = S.ID_Necesidad
                        INNER JOIN[dbo].[Usuario] U
                       ON S.Id_UsuarioEmisor = U.ID
                        INNER JOIN [dbo].[Estado] E
                       ON E.ID = S.ID_Estado
                        WHERE N.[ID_Usuario] = " + U.ID;

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
        
        [Route("api/solicitud/estado")]
        public HttpResponseMessage Post(Estado S)
        {
            string query = @"UPDATE Solicitud
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
        [Route("api/solicitud/solicituddesdenecesidad")]
        public HttpResponseMessage Post(Necesidad N)
        {
            string query = @"
                           SELECT S.ID
                          ,D.titulo
	                      ,CAST(CAST(S.fechaCreacion AS DATE) AS VARCHAR) as 'fechaCreacion'
	                      ,D.direccion
                          ,S.ID_Donacion             
                        FROM [WEBAPPDB].[dbo].[Solicitud] S
                        INNER JOIN [dbo].[Donacion] D
                        ON S.ID_Donacion = D.ID
                        WHERE S.[ID_Necesidad] = " + N.ID;

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
