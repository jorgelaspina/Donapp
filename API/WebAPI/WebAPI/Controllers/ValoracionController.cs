using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebAPI.Controllers
{
    public class ValoracionController : ApiController
    {
        public string Post(Models.Valoracion v)
        {
            string query = @"insert into dbo.Valoracion SELECT GETDATE()," +
                v.estrellas + @"," +
                v.ID_Solicitud;
            try
            {
                
                DataTable table = new DataTable();
                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["WEBAPPDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                using (var da = new SqlDataAdapter(cmd))
               
                {
                    cmd.CommandType = CommandType.Text;
                    da.Fill(table);
                    
                }
                string procedureName = "[dbo].[AplicarResultadoDonacion]";
                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["WEBAPPDB"].ConnectionString))
                using (SqlCommand cmd2 = new SqlCommand(procedureName, con))
                {
                    cmd2.CommandType = CommandType.StoredProcedure;
                    cmd2.Parameters.Add(new SqlParameter("@ID_Sol", v.ID_Solicitud));
                    con.Open();
                    cmd2.ExecuteNonQuery();
                }
                    return "Valoración registrada";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}
