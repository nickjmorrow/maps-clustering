using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Helpers;
using Calc.Services;
using NUnit.Framework;

namespace CalcTests
{
    public class TourProviderTest
    {
        [Test]
        public void SolveTest()
        {
            var vertices = new [] { 0, 1, 2, 3 };
            var matrix = new double[4, 4]
            {
                {0, 10, 15, 20},
                {5, 0, 9, 10},
                {6, 13, 0, 12},
                {8, 8, 9, 0}
            };
            var expectedCost = 35.0;
            var expectedRoute = new [] { 0, 1, 3, 2, 0 };

            var DynamicProgramming = new TourProvider(vertices, matrix);
            IEnumerable<int> route = DynamicProgramming.Solve();

            Assert.IsTrue(ListComparer.Compare(expectedRoute, route.ToArray()));
        }
    }
}