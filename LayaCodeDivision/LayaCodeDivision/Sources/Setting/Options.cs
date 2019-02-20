using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using CommandLine;

public class Options
{
    // 运行完，是否自动关闭cmd
    [Option("autoEnd", Required = false, Default = true)]
    public bool autoEnd { get; set; }

    // 命令
    [Option("cmd", Required = false, Default = "mergejs")]
    public string cmd { get; set; }

    // 启动参数设置 配置路径
    [Option("optionSetting", Required = false, Default = "./LayaCodeDivision_Setting.json")]
    public string optionSetting { get; set; }

    // 输出路径
    [Option("outDir", Required = false, Default = "./laya_bin_out")]
    public string outDir { get; set; }

    // 输入路径
    [Option("inDir", Required = false, Default = "./laya_libs")]
    public string inDir { get; set; }




    public void Save(string path = null)
    {
        if (string.IsNullOrEmpty(path))
            path = "./LayaCodeDivision_Setting.json";

        string json = JsonHelper.ToJsonType(this);
        File.WriteAllText(path, json);
    }

    public static Options Load(string path = null)
    {
        if (string.IsNullOrEmpty(path))
            path = "./LayaCodeDivision_Setting.json";

        string json = File.ReadAllText(path);
        Options options = JsonHelper.FromJson<Options>(json);
        return options;
    }
}


public class OptionsMinConfig
{
    public string[] paths;
    public string savePath;


}