using System.Collections.Generic;
using WebApplication.Models.DTOs;

namespace Web.Models
{
    public class AhcInfo
    {
        public IEnumerable<AhcPoint> AhcPoints { get; set; }
    }

    public class AhcPoint : Point
    {
        public IEnumerable<ClusterInfo> ClusterInfos { get; set; }
    }

    public class ClusterInfo
    {
        public int ClusterCount { get; set; }
        public int ClusterId { get; set; }
    }
}