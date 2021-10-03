using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WEBAPPV2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonacionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public DonacionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        Public JsonResult Get()
        {
            string query = @"
                           SELECT [ID],CONVERT(VARCHAR(10), [fechaCreacion],120) as 'fechaCreacion',[titulo],[descripcion],[latitud],[longitud],[ID_Categoria],[ID_Estado]
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

        public string Post(Donacion d)
        {
            string query = @"insert into dbo.Donacion SELECT GETDATE(),'" +
                d.titulo + @"','" +
                d.descripcion +
                @"'," +
                d.latitud + @"," +
                d.longitud + @"," +
                //d.ID_Categoria + 
                @"1,(Select ID from dbo.Estado where estado = 'Ofrecido'), 1, 3, 1";
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
    }
}
}
