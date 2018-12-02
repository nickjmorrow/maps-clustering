using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Calc.Helpers
{
    public static class ListComparer
    {
        public static bool Compare<T>(IEnumerable<T> firstList, IEnumerable<T> secondList)
        {
            var flag = true;
            for (var i = 0; i < firstList.Count(); i++)
            {
                flag = flag && firstList.ToList()[i].Equals(secondList.ToList()[i]);
            }

            return flag;
        }
    }
}