using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using Calc.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebApplication.Services
{
    public class FileHandlerService
    {
        public IEnumerable<Point> ConvertFileToPoints(IFormFile file)
        {
            var xml = this.LoadAsXml(file);
            var json = this.ConvertXmlToJson(xml);
            return this.ParseJsonToPoints(json);
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

        private IEnumerable<Point> ParseJsonToPoints(JObject json)
        {
            return json["kml"]["Document"]["Folder"]["Placemark"].Select((p, i) =>
            {
                var name = p["name"].ToString();
                var coordinates = p["Point"]["coordinates"].ToString().Trim().Split(",");
                return new Point()
                {
                    PointId = i,
                    Name = name,
                    HorizontalDisplacement = Convert.ToDouble(coordinates[0]),
                    VerticalDisplacement = Convert.ToDouble(coordinates[1]),
                };
            });
        }
    }
}