using System.Collections.Generic;
using WebApplication.Models.DTOs;

namespace Web.Models
{
    public class AhcInfo
    {
        public IEnumerable<AhcPointDTO> AhcPoints { get; set; }
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