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
                                    ,[direccion],[ID_Categoria],[ID_Estado],D.[ID_Usuario],P.Nombre, P.Apellido, D.estrellasSegunDonante,
                                    dbo.dn_fn_CalculaDistancia('" + p.latitud + @"','" + p.longitud + @"', [latitud],[longitud],'K') as distancia,
                                    (Select AVG(CAST(D2.resultadoDonacion as FLOAT)) from Donacion D2 where D2.ID_Usuario = D.ID_Usuario and D2.resultadoDonacion <> 0 group by D2.ID_Usuario) as 'PuntajeDonador', [fotoFullName]
                            FROM [WEBAPPDB].[dbo].[Donacion] D
                            INNER JOIN Usuario U
                            ON U.Id = D.ID_Usuario
                            LEFT JOIN Persona P
                            ON P.ID_Usuario = U.ID
                            WHERE [ID_Estado] = 2 
                            AND NOT EXISTS (SELECT * FROM [WEBAPPDB].[dbo].[Solicitud] S WHERE S.[ID_Donacion] = D.[ID] AND S.[ID_UsuarioEmisor] = " + p.usuarioID +
                            @") AND D.[ID_Usuario] <> " + p.usuarioID ;
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
                d.ID_Estado + @"," +
                d.ID_Usuario + @"," +
                d.estrellasSegunDonante + @", 0,'" + d.fotoFullName + "'";

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

        [Route("api/Donacion/porsolicitud/{id}")]
        public HttpResponseMessage getDonacionesPorSolicitud(int id)
        {
            string query = @"
                           SELECT D.[ID],CONVERT(VARCHAR(10), d.[fechaCreacion],120) as 'fechaCreacion',d.[titulo],d.[descripcion],[latitud],[longitud],[direccion],[ID_Categoria],[estado]
                            ,d.[ID_Usuario],[estrellasSegunDonante],[resultadoDonacion] FROM
                            [WEBAPPDB].[dbo].[Donacion] D
                            INNER JOIN [Estado] E ON E.ID = D.ID_Estado
                            INNER JOIN [Solicitud] S ON S.Id_Donacion = D.ID    
                            WHERE S.[ID] = " + id;
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
        [Route("api/Donacion/ultimaDonacionID")]
        public HttpResponseMessage getUltimaDonacionID()
        {
            string query = @"SELECT MAX([ID]) as 'Id' FROM [WEBAPPDB].[dbo].[Donacion] D";
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

        [Route("api/donacion/donacionesRelacionadas")]
        public HttpResponseMessage PostDonacionesRelacionadas(Relacion r)
        {
            string query = @"
                            
                           SELECT D.[ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud]
                                    ,[direccion],[ID_Categoria],[ID_Estado],D.[ID_Usuario],P.Nombre, P.Apellido,D.estrellasSegunDonante,
                                    dbo.dn_fn_CalculaDistancia('" + r.latitud + @"','" + r.longitud + @"', [latitud],[longitud],'K') as distancia,
                                    (Select AVG(CAST(D2.resultadoDonacion as FLOAT)) from Donacion D2 where D2.ID_Usuario = D.ID_Usuario and D2.resultadoDonacion <> 0 group by D2.ID_Usuario) as 'PuntajeDonador'
                                    ,COUNT(1) as 'MatchLevel'
                            FROM [WEBAPPDB].[dbo].[Donacion] D
                            INNER JOIN(
                                        SELECT Value FROM STRING_SPLIT('" + r.titulo + @"', ' ') where LEN(Value) > 3
                                       ) T ON D.Titulo like '%' + T.value + '%'
                            INNER JOIN Usuario U ON U.Id = D.ID_Usuario
                            LEFT JOIN Persona P ON P.ID_Usuario = U.ID
                            WHERE [ID_Estado] = 2 
                            AND NOT EXISTS (SELECT * FROM [WEBAPPDB].[dbo].[Solicitud] S WHERE S.[ID_Donacion] = D.[ID] AND S.[ID_UsuarioEmisor] = " + r.usuarioID + @")
                            AND D.[ID_Usuario] <> " + r.usuarioID + @"
                             GROUP BY D.[ID], D.[fechaCreacion], D.[titulo], D.[descripcion], D.[latitud], D.[longitud], D.[direccion], D.[ID_Categoria], D.[ID_Estado], D.[ID_Usuario], P.Nombre, P.Apellido, D.estrellasSegunDonante"
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
        [Route("api/donacion/guardarImagen")]
        public string guardarImagen()
        {
            string filename = "";
            try
            {
                var httpRequest = System.Web.HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                filename = postedFile.FileName;
                var physicalPath = System.Web.HttpContext.Current.Server.MapPath("~/fotosDonacion/" + filename);

                postedFile.SaveAs(physicalPath);
                return filename;
            }
            catch (Exception e)
            {
                return "error loading profile picture: " + e.Message + ". FileName= " + filename;
            }
        }

    }
}

