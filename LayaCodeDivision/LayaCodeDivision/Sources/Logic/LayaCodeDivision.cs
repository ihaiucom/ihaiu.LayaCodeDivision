using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

class LayaCodeDivision
{
    string outDir;

    public void Start(string inDir, string outDir)
    {
        this.outDir = outDir;

        //ReadFile(inDir + "/laya.d3.js");
        //ReadFile(inDir + "/laya.d3Plugin.js");
        //ReadFile(inDir + "/laya.core.js");
        //ReadFile(inDir + "/laya.ui.js");
        //ReadFile2(inDir + "/laya.device.js");
        //ReadFile2(inDir + "/laya.webgl.js");
        ReadFile2(inDir + "/laya.filter.js");
        ReadFile2(inDir + "/laya.effect.js");
        ReadFile2(inDir + "/laya.pathfinding.js");
        ReadFile2(inDir + "/laya.tiledmap.js");
        ReadFile2(inDir + "/laya.wxmini.js");

        //string[] files = Directory.GetFiles(intDir, "*.js");

        //List<string> ignoreList = new List<string>(new string[] 
        //{
        //    "bytebuffer.js",
        //    "domparserinone.js",
        //    ""
        //});

        //for (int i = 0; i < files.Length; i++)
        //{
        //    if (ignoreList.IndexOf(Path.GetFileName(files[i])) == -1)
        //        continue;
        //    ReadFile(files[i]);

        //}
    }

    public void ReadFile(string path)
    {
        string content = File.ReadAllText(path);

        string[] array = content.Split("*<code>");


        string dir = outDir + "/" + Path.GetFileName(path).Replace(".js", "").Replace("laya.", "") ;

        string pattern = @"var (.*)\s*=\(function";

        for(int i = 0; i < array.Length; i ++)
        {

            string code = array[i];
            MatchCollection matchCollection = Regex.Matches(code, pattern, RegexOptions.IgnoreCase);
            foreach (Match match in matchCollection)
            {
                string clsName = (string)match.Groups[1].Value;
                code = @"/**
*<code>"
    + code;

                string outPath = dir + "/" + clsName + ".js";
                PathHelper.CheckPath(outPath);
                File.WriteAllText(outPath, code);


                Console.WriteLine(clsName);

            }
        }
    }


    public void ReadFile2(string path)
    {
        string content = File.ReadAllText(path);

        string[] array = content.Split("//class");


        string dir = outDir + "/" + Path.GetFileName(path).Replace(".js", "").Replace("laya.", "");

        string pattern = @"var (.*)\s*=\(function";

        for (int i = 0; i < array.Length; i++)
        {

            string code = array[i];
            MatchCollection matchCollection = Regex.Matches(code, pattern, RegexOptions.IgnoreCase);
            foreach (Match match in matchCollection)
            {
                string clsName = (string)match.Groups[1].Value;
                code = @"//class"
    + code;

                string outPath = dir + "/" + clsName + ".js";
                PathHelper.CheckPath(outPath);
                File.WriteAllText(outPath, code);


                Console.WriteLine(clsName);

            }
        }
    }


}