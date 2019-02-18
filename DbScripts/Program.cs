﻿using System;
using System.Linq;
using System.Reflection;
using DbUp;

namespace DbScripts
{
    class Program
    {
        static int Main(string[] args)
        {
//            var connectionString =
//                args.FirstOrDefault()
//                ?? "Server=localhost;Initial Catalog=MapClusterer;Persist Security Info=False;User ID=sa;Password=Bw$g4asmG3nL4p;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;";
            var endpoint = "njm.cjbl7cfof767.us-east-2.rds.amazonaws.com";
            var connectionString = $"Server = {endpoint},1433; Initial Catalog = myDatabase; Persist Security Info = False; User ID = nickjmorrow; Password = myPassword382; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = True; Connection Timeout = 30;";

            var upgrader =
                DeployChanges.To
                    .SqlDatabase(connectionString)
                    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                    .LogToConsole()
                    .Build();

            var result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(result.Error);
                Console.ResetColor();
#if DEBUG
                Console.ReadLine();
#endif                
                return -1;
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Success!");
            Console.ResetColor();
            return 0;
        }
    }
}