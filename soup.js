/*
* Ing.Charles Rodriguez
*/

function soupIndex() {
  var selft = this;
  this.constructor = function () {
    this.component_init();
  },
    this.component_init = function () {
      const preloader = '<div class="lds-roller">Cargando...<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';

      $(document).on('submit', '#form-soup', (event) => {
        event.preventDefault();

        let soup = $('textarea#soup').val().split("\n");
        soup.forEach((item, key) => soup[key] = item.split(''));
        soup.forEach((item, key) => {
          soup[key] = item.filter((letter) => letter.trim().toUpperCase());
        });

        let searchWords = $('input#words').val().split(',');
        searchWords.forEach((letter, key) => searchWords[key] = letter.trim().toUpperCase());
        searchWords = searchWords.filter(letter => letter.length > 0);
        let data = { soup, searchWords };

        $.ajax({
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': 'http://localhost'
          },
          beforeSend: function () {
            $.blockUI({
              message: preloader,
              css: { 'z-index': 100020, backgroundColor: 'transparent', color: '#fff', opacity: '1', border: 'none' }
            });
          },
          crossDomain: true,
          url: 'http://localhost:8086/api/soup',
          type: 'POST',
          data: JSON.stringify(data),
        })
          .done(data => {
            let html = 'Resultado => ';

            for (const i in data) {
              if (data.hasOwnProperty(i)) {
                html += `${i}: ${data[i]}. `;
              }
            }
            $('span#result').html(html);
            if (JSON.stringify(data).length > 2) alert(html);
          })
          .fail(data => alert(JSON.stringify(data)))
          .always(() => $.unblockUI());
      });

      $('textarea#soup').on('keyup', (event) => {
        let soup = $('textarea#soup').val().split("\n");

        soup.forEach((item, key) => {
          soup[key] = item.split('');
        });

        soup.forEach((item, key) => {
          soup[key] = item.filter((letter) => letter.trim());
        });

        let html = '';
        soup.forEach((item) => {
          html += '<tr>'
          item.forEach(letter => {
            html += `<td class="pb-0 pt-0 pl-2 p-1" style="border-top: 0;">${letter}</td>`;
          });
          html += '</tr>';
        });

        $('table#table-soup-view tbody').html(html);
        $('span#result').html('');
      });

      $('input#words').on('keyup', (e) => {
        let words = $('input#words').val().split(',');

        words.forEach((letter, key) => {
          words[key] = letter.trim().toUpperCase();
        });
        words = words.filter(letter => letter.length > 0);

        $('span#wordsToSearch').html(words.join(', '));

        $('div#words-box').addClass('d-none');
        if (words.length >= 1)
          $('div#words-box').removeClass('d-none');
        $('span#result').html('');
      });
    }
}

$(() => {
  let soup_index = new soupIndex();
  soup_index.constructor();
});
