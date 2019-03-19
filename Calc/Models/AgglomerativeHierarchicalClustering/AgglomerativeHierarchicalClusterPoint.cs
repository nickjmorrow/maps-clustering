﻿using System.Collections.Generic;

namespace Calc.Models.AgglomerativeHierarchicalClustering
{
    public class AgglomerativeHierarchicalClusterPoint : Point
    {
        public IEnumerable<AgglomerativeHierarchicalClusterInfo> AgglomerativeHierarchicalClusterInfos { get; set; }

        public AgglomerativeHierarchicalClusterPoint()
        {
            this.AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>();
        }

        public override bool Equals(object obj)
        {
            var point = obj as Point;
            if (point == null)
            {
                return false;
            }
            return PointId == point.PointId;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}