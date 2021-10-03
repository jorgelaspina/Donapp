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
    public class ConversacionController : ApiController
    {
        public string Post(Models.Conversacion c)
        {
            string query = @"insert into dbo.Conversacion SELECT GETDATE()," +
                c.ID_Solicitud + @", 'Abierta'";
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
                return "Conversacion abierta";
            }
            catch (Exception)
            {
                return query;
            }
        }
    }
}
