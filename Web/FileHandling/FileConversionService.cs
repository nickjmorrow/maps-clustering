using System.IO;
using System.Xml;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Web.Services
{
    public class FileConversionService
    {
        public JObject ConvertFileToJson(IFormFile file)
        {
            var xml = this.LoadAsXml(file);
            return this.ConvertXmlToJson(xml);
        }
        
        private XmlDocument LoadAsXml(IFormFile file)
        {
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                var contents = reader.ReadToEnd();
                var xml = new XmlDocument();
                xml.LoadXml(contents);
                return xml;   
            }
        }

        private JObject ConvertXmlToJson(XmlDocument xml)
        {
            string json = JsonConvert.SerializeXmlNode(xml);
            return JObject.Parse(json);
        }
    }
}