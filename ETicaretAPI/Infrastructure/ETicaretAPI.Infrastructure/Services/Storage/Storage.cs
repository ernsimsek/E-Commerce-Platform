using ETicaretAPI.Application.Abstractions.Storage;
using ETicaretAPI.Infrastructure.Operations;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Infrastructure.Services.Storage
{
    public class Storage : IStorage
    {
        protected async Task<string> FileRenameAsync(string pathOrContainerName, string fileName, Func<string, string, bool> hasFileMethod, bool first = true)
        {
            string newFileName = await Task.Run<string>(async () =>
            {
                string extension = Path.GetExtension(fileName);
                string newFileName = string.Empty;
                if (first)
                {
                    string oldName = Path.GetFileNameWithoutExtension(fileName);
                    newFileName = $"{NameOperation.CharacterRegulatory(oldName)}{extension}";
                }
                else
                {
                    newFileName = fileName;
                    int indexNo1 = newFileName.IndexOf('-');
                    if (indexNo1 == -1)
                        newFileName = $"{Path.GetFileNameWithoutExtension(newFileName)}-2{extension}";
                    else
                    {
                        int lastIndex = 0;
                        while (true)
                        {
                            lastIndex = indexNo1;
                            indexNo1 = newFileName.IndexOf('-', indexNo1 + 1);
                            if (indexNo1 == -1)
                            {
                                indexNo1 = lastIndex;
                                break;
                            }
                        }

                        int indexNo2 = newFileName.IndexOf(".");
                        
                        // Negatif uzunluk hesaplamasını önlemek için güvenlik kontrolü
                        string fileNo;
                        if (indexNo2 > indexNo1 + 1)
                        {
                            fileNo = newFileName.Substring(indexNo1 + 1, indexNo2 - indexNo1 - 1);
                        }
                        else
                        {
                            // Eğer indexNo2 <= indexNo1 + 1 ise, varsayılan bir değer kullan
                            fileNo = "2";
                        }

                        if (int.TryParse(fileNo, out int _fileNo))
                        {
                            _fileNo++;
                            newFileName = newFileName.Remove(indexNo1 + 1, indexNo2 - indexNo1 - 1)
                                                     .Insert(indexNo1 + 1, _fileNo.ToString());
                        }
                        else
                            newFileName = $"{Path.GetFileNameWithoutExtension(newFileName)}-2{extension}";

                    }
                }

                if (hasFileMethod(pathOrContainerName, newFileName))
                    return await FileRenameAsync(pathOrContainerName, newFileName, hasFileMethod, false);
                else
                    return newFileName;
            });

            return newFileName;
        }

        public virtual Task<List<(string fileName, string pathOrContainerName)>> UploadAsync(string pathOrContainerName, IFormFileCollection files)
        {
            throw new NotImplementedException();
        }

        public virtual Task DeleteAsync(string pathOrContainerName, string fileName)
        {
            throw new NotImplementedException();
        }

        public virtual List<string> GetFiles(string pathOrContainerName)
        {
            throw new NotImplementedException();
        }

        public virtual bool HasFile(string pathOrContainerName, string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
