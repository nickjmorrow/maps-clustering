using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Web.Services;
using WebApplication.Controllers;
using WebApplication.Models;
using WebApplication.Models.DTOs;

namespace WebApplication.Services
{
    public class FileHandlerService
    {
        private FileConversionService _fileConversionService { get; set; }

        public FileHandlerService(FileConversionService fileConversionService)
        {
            this._fileConversionService = fileConversionService;
        }

        public PointsGroup ConvertFileToPointsGroup(IFormFile file)
        {
            var json = this._fileConversionService.ConvertFileToJson(file);
            var points = this.ParseJsonToPoints(json);
            return this.BuildPointsGroup(points, this.FormatFileName(file.FileName));
        }
        
        private PointsGroup BuildPointsGroup(IEnumerable<Point> points, string fileName)
        {
            var averageHorizontalDisplacement = points
                .Select(p => p.HorizontalDisplacement)
                .Average();

            var averageVerticalDisplacement = points
                .Select(p => p.VerticalDisplacement)
                .Average();

            return new PointsGroup()
            {
                Name = fileName,
                Points = points.ToList(),
                AverageHorizontalDisplacement = averageHorizontalDisplacement,
                AverageVerticalDisplacement = averageVerticalDisplacement
            };
        }

        private IEnumerable<Point> ParseJsonToPoints(JObject json)
        {
            return json["kml"]["Document"]["Folder"]["Placemark"].Select((p, i) =>
            {
                var name = p["name"].ToString();
                var coordinates = p["Point"]["coordinates"].ToString().Trim().Split(",");
                return new Point()
                {
                    Name = name,
                    HorizontalDisplacement = Convert.ToDouble(coordinates[0]),
                    VerticalDisplacement = Convert.ToDouble(coordinates[1]),
                };
            });
            
        }
        
        private string FormatFileName(string initialFileName)
        {
            return initialFileName.Split(".")[0];
        }
    }
}