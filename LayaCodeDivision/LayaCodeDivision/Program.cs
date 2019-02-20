using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

class Program
{
    static void Main(string[] args)
    {
        //注册EncodeProvider
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);



        Setting.Init(args);


        switch (Setting.cmd)
        {
            // 合并js
            case CmdType.download:
                download();
                break;
        }

        download();

        Console.WriteLine("完成!");

        //if (!Setting.Options.autoEnd)
            Console.Read();
    }

    static void download()
    {
        //Setting.Options;
        new LayaCodeDivision().Start(Setting.Options.inDir, Setting.Options.outDir);
    }

}