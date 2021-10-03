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
    public class DonacionController : ApiController
    {
        [Route("api/donacion/donacionescercanas")]
        public HttpResponseMessage Post(Posicion p)
        {
            string query = @"
                           SELECT D.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud]
                                    ,[direccion],[ID_Categoria],[ID_Estado],D.[ID_Usuario],P.Nombre, P.Apellido,
                                    dbo.dn_fn_CalculaDistancia('" + p.latitud + @"','" + p.longitud + @"', [latitud],[longitud],'K') as distancia  
                            FROM [WEBAPPDB].[dbo].[Donacion] D
                            INNER JOIN Usuario U
                            ON U.Id = D.ID_Usuario
                            LEFT JOIN Persona P
                            ON P.ID_Usuario = U.ID
                            WHERE D.[ID_Usuario] <> " + p.usuarioID;
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
        public HttpResponseMessage Get()
        {
            string query = @"
                           SELECT [ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud],[direccion],[ID_Categoria],[ID_Estado]
                            ,[ID_Usuario],[estrellasSegunDonante],[resultadoDonacion] FROM
                            [WEBAPPDB].[dbo].[Donacion]";
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

        [Route("api/Donacion/misdonaciones")]
        public HttpResponseMessage PostMisDonaciones(Usuario U)
        {
            string query = @"
                           SELECT D.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud],[direccion],[ID_Categoria],[estado]
                            ,[ID_Usuario],[estrellasSegunDonante],[resultadoDonacion] FROM
                            [WEBAPPDB].[dbo].[Donacion] D
                            INNER JOIN [Estado] E ON E.ID = D.ID_Estado WHERE E.estado <> 'No Disponible'  and [ID_Usuario] = "+U.ID;
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
        public string Post(Donacion d)
        {
            string query = @"insert into dbo.Donacion SELECT GETDATE(),'" +
                d.titulo + @"','" +
                d.descripcion + @"'," +
                d.latitud + @"," +
                d.longitud + @",'" +
                d.direccion + @"'," +
                d.ID_Categoria + @"," +
                @"(Select ID from dbo.Estado where estado = 'Disponible'), " +
                d.ID_Usuario + @"," +
                d.estrellasSegunDonante + @", 0";

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
                return "Donación cargada";

            }
            catch (Exception)
            {
                return "Error al cargar donación";
            }
        }
        [Route("api/donacion/estado")]
        public HttpResponseMessage Post(Estado S)
        {
            string query = @"UPDATE Donacion
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

    }
}
