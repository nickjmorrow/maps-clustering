using System;
using System.Collections.Generic;
using Calc;
using Calc.Models;
using Web.Models;
using Web.Services;
using WebApplication.Enums;

namespace WebApplication.Models.DTOs
{
    public class PointsGroupDto
    {
        public int PointsGroupId { get; set; }
        public string Name { get; set; }
        public double AverageHorizontalDisplacement { get; set; }
        public double AverageVerticalDisplacement { get; set; }
        public IEnumerable<PointDto> Points { get; set; }
        public ItemPermissionType ItemPermissionType { get; set; }
        public CalculationOutputModel CalculationOutput { get; set; }
    }
}
