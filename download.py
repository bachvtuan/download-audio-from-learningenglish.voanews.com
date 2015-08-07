import urllib2,sys,json,os

#You can change to your own path
save_folder  = "/home/bvtuan/Desktop/voa_learning_english"

def chunk_report(bytes_so_far, total_size,mb_size):
  percent = float(bytes_so_far) / total_size
  percent = round(percent*100, 2)
  sys.stdout.write("Downloaded %d of %0.2f bytes (%.3f MB) (%0.2f%%)\r" % 
    (bytes_so_far, total_size, mb_size, percent))

  if bytes_so_far >= total_size:
    sys.stdout.write('\n')

def chunk_read(response, chunk_size=8192, report_hook=None):
  total_size = response.info().getheader('Content-Length').strip()
  total_size = int(total_size)
  mb_size = total_size/float(1024*1024)
  
  bytes_so_far = 0
  data = []

  while 1:
    chunk = response.read(chunk_size)
    bytes_so_far += len(chunk)

    if not chunk:
      break
    data += chunk
    if report_hook:
      report_hook(bytes_so_far, total_size,mb_size)

  return "".join(data)

def write_file_from_url(url , file_path):
  response = urllib2.urlopen( url  )
  output = open(file_path, "w")
  output.write(chunk_read(response, report_hook=chunk_report))
  output.close()

if __name__ == '__main__':

  file = open('data.txt', 'r')
  articles = json.loads(file.read())
  
  index = 1;

  #Create folder if folder doesn't exist
  if not os.path.exists(save_folder):
    os.makedirs(save_folder)

  for article in articles:
    title = article['title']
    category = article['category']

    category_path = save_folder + "/" + category
    if not os.path.exists(category_path):
      os.makedirs(category_path)

    article_name = article['pub_date'] + ' ' + article['title']

    article_path = category_path + "/" + article_name

    print ("Downloading article {0}: {0}/{1} files".format(article_name.encode("utf-8"), index, len(articles)))

    if not os.path.exists(article_path):
      os.makedirs(article_path)
    else:
      index +=1
      print ("Already download, ignore it")
      continue

    #Remove uncessary string at the end of file
    enclosure_path = article_path + "/enclosure.jpg"
    # pdf_path = article_path + "/document.pdf"
    

    print ("downloading enclosure")
    write_file_from_url( article['enclosure'], enclosure_path )

    # print "  downloading pdf"
    # write_file_from_url( article['pdf_url'], pdf_path )
    
    if "audio_link" in article:
      print ("Downloading audio")
      write_file_from_url( article['audio_link'], article_path + "/"+ article['title'] +".mp3" )
    else:
      print ("Downloading video")
      write_file_from_url( article['video_link'], article_path + "/"+ article['title'] +".mp4" )
    
    index += 1

  print ("Download done, have fun :)")