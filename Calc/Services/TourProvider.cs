using System;
using System.Collections.Generic;
using System.Linq;

namespace Calc.Services
{
    public class TourProvider
    {
        public static readonly int Infinity = 1000000000;

        public int GetMinCost(int[][] distance)
        {
            var minCostDP = new Dictionary<Index, int>();
            var parent = new Dictionary<Index, int>();
            var allSets = this.GenerateCombination(distance.Length - 1);

            foreach (var set in allSets)
            {
                for (var currentVertex = 1; currentVertex < distance.Length; currentVertex++)
                {
                    if (set.Contains(currentVertex))
                    {
                        continue;
                    }

                    var index = new Index(currentVertex, set);
                    var minCost = Infinity;
                    var minPrevVertex = 0;

                    var copySet = new HashSet<int>(set);
                    foreach (var prevVertex in set)
                    {
                        var cost = distance[prevVertex][currentVertex] + GetCost(copySet, prevVertex, minCostDP);
                        if (cost < minCost)
                        {
                            minCost = cost;
                            minPrevVertex = prevVertex;
                        }
                    }
                    
                    // empty subset
                    if (set.Count == 0)
                    {
                        minCost = distance[0][currentVertex];
                    }

                    minCostDP[index] = minCost;
                    parent[index] = minPrevVertex;
                }
            }

            var mySet = new HashSet<int>();
            for (var i = 0; i < distance.Length; i++)
            {
                mySet.Add(i);
            }

            var min = Infinity;
            var myPrevVertex = -1;
            var myCopySet = new HashSet<int>(mySet);
            foreach (var k in mySet)
            {
                var cost = distance[k][0] + GetCost(myCopySet, k, minCostDP);
                if (cost < min)
                {
                    min = cost;
                    myPrevVertex = k;
                }
            }

            parent[new Index(0, mySet)] = myPrevVertex;
            this.PrintTour(parent, distance.Length);
            return min;
        }

        private void PrintTour(Dictionary<Index, int> parent, int totalVertices)
        {
            var set = new HashSet<int>();
            for (var i = 0; i < totalVertices; i++)
            {
                set.Add(i);
            }

            var start = 0;
            var stack = new Stack<int>(); 
            while (true)
            {
                stack.Push(start);
                set.Remove(start);
                parent.TryGetValue(new Index(start, set), out var tryStart);
                if (tryStart == null)
                {
                    break;
                }
            }

            Console.WriteLine(stack.ToList());
        }

        private static int GetCost(HashSet<int> set, int prevVertex, Dictionary<Index, int> minCostDP)
        {
            set.Remove(prevVertex);
            var index = new Index(prevVertex, set);
            var cost = minCostDP[index];
            set.Add(prevVertex);
            return cost;
        }

        private List<HashSet<int>> GenerateCombination(int n)
        {
            var inputs = new int[n];
            for (var i = 0; i < inputs.Length; i++)
            {
                inputs[i] = i + 1;
            }

            var allSets = new List<HashSet<int>>();
            var results = new int[inputs.Length];
            this.GenerateCombination(inputs, 0, 0, allSets, results);
            allSets.Sort((as1, as2) => as1.Count - as2.Count);
            return allSets;
        }

        private void GenerateCombination(int[] inputs, int start, int position, List<HashSet<int>> allSets,
            int[] results)
        {
            var set = this.CreateSet(results, position);
            allSets.Add(set);
            for (var i = start; i < inputs.Length; i++)
            {
                results[position] = inputs[i];
                this.GenerateCombination(inputs, i + 1, position + 1, allSets, results);
            }
        }

        private HashSet<int> CreateSet(int[] inputs, int position)
        {
            if (position == 0)
            {
                return new HashSet<int>();
            }

            var set = new HashSet<int>();

            for (var i = 0; i < position; i++)
            {
                set.Add(inputs[i]);
            }

            return set;
        }
        
    }

    public class Index
    {
        public int CurrentVertex;
        public HashSet<int> VertexSet;

        public Index(int vertex, HashSet<int> vertexSet)
        {
            this.CurrentVertex = vertex;
            this.VertexSet = vertexSet;
        }
        
        public override bool Equals(object o)
        {
            if (this == o) return true;
            if (o == null) return false;

            var index = (Index) o;

            if (this.CurrentVertex != index.CurrentVertex) return false;
            if (this.VertexSet != null)
            {
                return VertexSet.SetEquals(index.VertexSet);
            }

            return index.VertexSet == null;
        }

        public override int GetHashCode()
        {
            return 31 * this.CurrentVertex + (this.VertexSet == null ? 0 : this.VertexSet.GetHashCode());
        }
    }
}