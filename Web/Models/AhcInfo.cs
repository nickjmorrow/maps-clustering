using System.Collections.Generic;
using Calc.Models;
using Point = WebApplication.Models.DTOs.Point;

namespace Web.Models
{
    public class AhcInfo
    {
        public IEnumerable<AhcPointDTO> AhcPoints { get; set; }
        public IEnumerable<InterclusterDistance> InterClusterDistances { get; set; }
        public IEnumerable<ClusteringSummary> ClusterSummaries { get; set; }
    }

    public class AhcPointDTO : Point
    {
        public IEnumerable<ClusterInfo> ClusterInfos { get; set; }
    }

    public class ClusterInfo
    {
        public int ClusterCount { get; set; }
        public int ClusterId { get; set; }
    }


}