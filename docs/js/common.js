function changeFormType(type){
  if (type) {
    $('#reason').val(type);
  } 
  type = $('#reason').val() || 'general';
  $('#name').focus();
  $('#inquiry-form .form-group').addClass('hide');
  $('#inquiry-form .' + type + '-form').removeClass('hide');
}

$('#inquiry-form').submit(function(e) {
    $('#messages .alert').addClass('hide');
    $.ajax({
      method: "POST",
      url: "email.php",
      data: $('#inquiry-form').serialize()
    })
    .done(function(response) {
      if(response == "Mail sent: 1, 1"){
        $('#inquiry-form')[0].reset();
        $('#messages .alert-success').removeClass('fade hide').delay(5000).queue(function(){
          $(this).addClass('fade').dequeue();
        }).delay(100).queue(function(){
          $(this).addClass('hide').dequeue();
        });
      } else {
        $('span.email').text('admin@atomicuscavaliers.com');
        $('#messages .alert-danger').removeClass('fade hide');
      } 
    })
    .fail(function(response){
      $('span.email').text('admin@atomicuscavaliers.com');
      $('#messages .alert-danger').removeClass('fade hide');
    });
    e.preventDefault();
});

/* TODO: fix cross domain issues */
let familyTrees = {
    "luna": {
        "name": "Atomicus Cresent Moon",
        "sire": {
            "name": "Wenaweve Time Warp",
            "sire": {
                "name": "Wenaweve A Moment In Time (UK)",
                "sire": {
                    "name": "Ch Cobbets Cockney Rebel (UK)"
                },
                "dam": {
                    "name": "Ch Ponlenez Aria"
                }
            },
            "dam": {
                "name": "Ch Wenaweve Stardust",
                "sire": {
                    "name": "Ch Caralean Tuscan Sky (UK)"
                },
                "dam": {
                    "name": "Wenaweve Atime Tdream"
                }
            }
        },
        "dam": {
            "name": "Jehannah Wild Flower",
            "sire": {
                "name": "Ch Cobbets Cockney Rebel (UK)",
                "sire": {
                    "name": "Cobbets Dizzy Rascal (UK)"
                },
                "dam": {
                    "name": "Cobbets Lula Tallulah (UK)"
                }
            },
            "dam": {
                "name": "Jehannah Nemesis",
                "sire": {
                    "name": "GT Ch Barodaley Hugo Boss"
                },
                "dam": {
                    "name": "Ch Melloway Picturesque"
                }
            }
        }
    },
    "taylor": {
        "name": "Jehannah Wild Flower",
        "sire": {
            "name": "Ch Cobbets Cockney Rebel (IMP UK)",
            "sire": {
                "name": "Cobbets Dizzy Rascal (UK)",
                "sire": {
                    "name": "Maibee Montrose (UK)"
                },
                "dam": {
                    "name": "Cobbets Dizzy Doris (UK)"
                }
            },
            "dam": {
                "name": "Cobbets Lula Tallulah (UK)",
                "sire": {
                    "name": "UK Ch Aranel Cosmic (UK)"
                },
                "dam": {
                    "name": "Cobbets Honey Bee (UK)"
                }
            }
        },
        "dam": {
            "name": "Jehannah Nemesis",
            "sire": {
                "name": "GT Ch Barodaley Hugo Boss",
                "sire": {
                    "name": "Ch Prenchy Patric Le Beau (IMP UK)"
                },
                "dam": {
                    "name": "Dougsba Summer Romance"
                }
            },
            "dam": {
                "name": "Ch Melloway Picturesque",
                "sire": {
                    "name": "Ch Chantismere Chesterfield (IMP UK)"
                },
                "dam": {
                    "name": "Grand Ch Melloway Picture Perfect"
                }
            }
        }
    }
};


function getFamilyTreeData(dog){
    /* TODO: fix cross domain issues
    let filename = `${dog}-family-tree.json`;
    $.getJSON(`json/${filename}`, function(data){
        alert(data);
    }, crossDomain=true);
    */
    return familyTrees[dog];
}

/* TODO: more reactoring of following generation functions required */
function generateEntry(type, dog, nestedData){
    return `<div class="entry">
                <span class="label"><strong>${type}:</strong> ${dog['name']}</span>
                ${nestedData}
            </div>`;
}

function generateLevel3Html(data){
    return `<div class="branch lv3">\n
            ${generateEntry('S', data['sire'], '')}
            ${generateEntry('D', data['dam'], '')}
            </div>`;
}

function generateLevel2Html(data){
    return `<div class="branch lv2">
                ${generateEntry('S', data['sire'], generateLevel3Html(data['sire']))}
                ${generateEntry('D', data['dam'], generateLevel3Html(data['dam']))}
            </div>`
}

function generateLevel1Html(data){
    return `<div class="branch lv1">
                ${generateEntry('Sire', data['sire'], generateLevel2Html(data['sire']))}
                ${generateEntry('Dam', data['dam'], generateLevel2Html(data['dam']))}
            </div>`
}

function generateFamilyTreeHtml(data){
    let html = `<div id="wrapper"><span class="label">${data["name"]}</span>${generateLevel1Html(data)}</div>`;
    return html;
}

(function loadFamilyTrees(){
    for (let dog of ['taylor', 'luna']){
        $(`#modal-${dog}-pedigree`).html(generateFamilyTreeHtml(getFamilyTreeData(dog)));
    }
}());