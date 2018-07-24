(function( glob ){
    glob.newpage =  ''; 
    glob.more = 4;
    $('#next').css({'display': 'none'});

    $('#next').click(function(e){
        e.preventDefault();
        let query = $('#search').val().trim();
        $('#res').html('');
        searchByChannelName(query);
    });

    let keys = {
        key: 'AIzaSyCAbyHbbq5hc4gfJKq_IPMQ5DEjLSnw4s0'
    }
    
    $('#myform').submit(function(e){
        e.preventDefault();
     
       let query = $('#search').val();
       if (query == '') {
           $('#res').html('<h1>The is no content</h1>');
           $('#next').css({ 'display': 'none' });
           return false;
       }
       $('#res').html('');
        searchByChannelName(query);
        more = 4;
    });

    function searchByChannelName(query) {
        let URL = 'https://www.googleapis.com/youtube/v3/search';
     
        options = {
            part: 'snippet',
            key: keys.key,
            q: query,
            type: 'channel',
            maxResults: 24,
            pageToken: newpage

        }

        $.get(URL, options, function( data ){
           newpage = data.nextPageToken;
         //  console.log(data);
           
        $.each(data.items, function (i, item) { 
            let channelID = item.id.channelId;
                $('#res').append(`
                    <div class="channels">
                        <h6>${item.snippet.title}</h6>
                        <img src = "${item.snippet.thumbnails.default.url}" / >
                        <p>${item.snippet.description}</p>
                    </div>         
                `);
                
            });

            let total = data.pageInfo.totalResults;
            let res = data.pageInfo.resultsPerPage;

            if (total > more) {
                $('#next').css({ 'display': 'block' });
                more += 24;
                console.log(more);
            }else {
                $('#next').css({ 'display': 'none' });
                console.log(more);
            }
         
        });
    }

    function getChannelsId(channelID) {

        let URL = 'https://www.googleapis.com/youtube/v3/channels';

        options = {
            part: 'snippet',
            key: keys.key,
            id: channelID
        }

        $.get( URL, options,
                function (data) {
                    let channelID = data.items[0].id;
                   // console.log(data.items[0].id)
                   playListById( channelID );
                }
        );

    }

    function playListById( channelID ) {
        let URL = 'https://www.googleapis.com/youtube/v3/playlists';
       // let key = 'AIzaSyCAbyHbbq5hc4gfJKq_IPMQ5DEjLSnw4s0';

        options = {
            part: 'snippet',
            key: keys.key,
            maxResults: 20,
            channelId: channelID
        }
        $.get(URL, options,
            function (data) {
              $.each(data.items, function(i, item){
                  let playListID = item.id;
                  $('#res').append(`<img src="${item.snippet.thumbnails.medium.url}" />`);
                  getVideoID(playListID );
                }); // each function 
        });
    } 
  
    function getVideoID(playListID) {
        let URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

        options = {
            part: 'snippet',
            key: keys.key,
            maxResults: 20,
            playlistId: playListID
        }

         $.get(URL, options,
            function (data) {
              $.each(data.items, function(i, item){
                //console.log( item )
              }); // each function 
        });
    }

   
})( window );