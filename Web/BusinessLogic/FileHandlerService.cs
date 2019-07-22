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
        private readonly FileConversionService _fileConversionService;

        public FileHandlerService(FileConversionService fileConversionService)
        {
            this._fileConversionService = fileConversionService;
        }

        public PointsGroupModel ConvertFileToPointsGroupModel(IFormFile file)
        {
            var json = this._fileConversionService.ConvertFileToJson(file);
            var points = this.ParseJsonToPointModels(json);
            return this.BuildPointsGroupModel(points, FormatFileName(file.FileName));
        }
        
        private PointsGroupModel BuildPointsGroupModel(IReadOnlyList<PointModel> points, string fileName)
        {
            var averageHorizontalDisplacement = points
                .Select(p => p.HorizontalDisplacement)
                .Average();

            var averageVerticalDisplacement = points
                .Select(p => p.VerticalDisplacement)
                .Average();

            return new PointsGroupModel()
            {
                Name = fileName,
                Points = points.ToList(),
                AverageHorizontalDisplacement = averageHorizontalDisplacement,
                AverageVerticalDisplacement = averageVerticalDisplacement
            };
        }

        private IReadOnlyList<PointModel> ParseJsonToPointModels(JObject json)
        {
            return json["kml"]["Document"]["Folder"]["Placemark"].Select((p, i) =>
            {
                var name = p["name"].ToString();
                var coordinates = p["Point"]["coordinates"].ToString().Trim().Split(",");
                return new PointModel()
                {
                    Name = name,
                    HorizontalDisplacement = Convert.ToDouble(coordinates[0]),
                    VerticalDisplacement = Convert.ToDouble(coordinates[1]),
                };
            }).ToList();
        }
        
        private static string FormatFileName(string initialFileName)
        {
            return initialFileName.Split(".")[0];
        }
    }
}