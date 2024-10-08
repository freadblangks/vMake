﻿const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub/edit/item")
    .build();

function updateSpellTooltip(elementId, spellEntry) {
    connection.invoke("GetSpellInfo", spellEntry, { id: elementId })
        .catch(function (err) {
            return console.error(err.toString());
        });
}

function updateSubClass(itemClass) { 
    connection.invoke("GetSubClasses", itemClass, {})
        .catch(function (err) {
            return console.error(err.toString());
        });
}

function getQualityColor(q) {
    switch (q) {
        case 0: return '9d9d9d';
        case 1: return 'ffffff';
        case 2: return '1eff00';
        case 3: return '0070dd';
        case 4: return 'a335ee';
        case 5: return 'ff8000';
        case 6: return 'e6cc80';
    }
    return '#ffffff';
}

function initializeTooltip() {
    console.log("Initializing tooltip.");

    // Details
    {
        $('#form-name').on('input', function () {
            $('#tooltip-name').text(`${$(this).val()}`);
        });

        $('#form-description').on('input', function () {
            let value = $(this).val();
            if (!value) {
                $(`#tooltip-description`).hide();
            }
            else {
                $(`#tooltip-description`).show();
            }
            $('#tooltip-description').text(`"${value}"`);
        });

        $('#form-quality').on('input', function () {
            let value = parseInt($(this).val());
            let color = getQualityColor(value);
            console.log(value);
            console.log(color);
            $('#tooltip-name').css('color', `#${color}`)
        });

        $('#form-invtype').on('input', function () {
            let value = $(this).val();
            if (value === "NotEquipable") {
                $(`#tooltip-invtype`).hide();
            }
            else {
                $(`#tooltip-invtype`).show();
            }
            $('#tooltip-invtype').text(`${$(this).find('option:selected').text()}`);
        });

        $('#form-iclass').on('input', function () {
            let itemClass = parseInt($(this).val());
            updateSubClass(itemClass);
        });

        $('#form-isubclass').on('input', function () {
            // Update tooltip with new selected item.
            $('#tooltip-isubclass').text($(this).find('option:selected').text());
        });

        connection.on("GetSubClassesCallback", function (response) {
            console.log(response);
            if (response.success) {
                let currentIndex = parseInt($('#form-isubclass').find('option:selected').val());
                let select = $('#form-isubclass');
                select.empty();

                $.each(response.object, function (key, value) {
                    select.append($('<option></option>').attr('value', key).text(value));
                });

                // Restore the old index
                let totalIndex = select.children().length;
                if (currentIndex <= totalIndex) {
                    select.prop('selectedIndex', currentIndex);
                }

                // Update tooltip with new selected item.
                $('#tooltip-isubclass').text($('#form-isubclass').find('option:selected').text());
            }
        });

        updateSubClass(parseInt($('#form-iclass').find('option:selected').val()));

        $('#form-bonding').on('input', function () {
            let value = $(this).val();
            if (value === "None") {
                $(`#tooltip-bonding`).hide();
            }
            else {
                $(`#tooltip-bonding`).show();
            }
            $('#tooltip-bonding').text(`${$(this).find('option:selected').text()}`);
        });

        $('#form-itemlevel').on('input', function () {
            $('#tooltip-itemlevel').text(`Item Level ${$(this).val()}`);
        });

        $('#form-reqlevel').on('input', function () {
            let value = $(this).val();
            console.log(value);
            if (!value || value === '0') {
                $(`#tooltip-reqlevel`).hide();
            }
            else {
                $(`#tooltip-reqlevel`).show();
            }
            $('#tooltip-reqlevel').text(`Requires Level ${value}`);
        });
    }

    // Stats
    {
        $('#form-armor').on('input', function () {
            let value = $(this).val();
            if (!value) {
                $(`#tooltip-armor`).hide();
            }
            else {
                $(`#tooltip-armor`).show();
            }
            $('#tooltip-armor').text(`${value} Armor`);
        });

        for (let i = 1; i < 11; i++) {
            $(`#form-stat-type-${i}`).on('input', function () {
                let type = parseInt($(this).val());
                if (type == 0) {
                    $(`#tooltip-stat-${i}`).hide();
                }
                else {
                    $(`#tooltip-stat-${i}`).show();
                }
                $(`#tooltip-stat-type-${i}`).text(`${$(this).find('option:selected').text()}`);
            });
        }
        for (let i = 1; i < 11; i++) {
            $(`#form-stat-value-${i}`).on('input', function () {
                let value = parseInt($(this).val());
                let sign = value > 0 ? '+' : '';
                $(`#tooltip-stat-value-${i}`).text(`${sign}${value}`);
            });
        }
    }

    // Spells
    {
        for (let id = 1; id < 6; id++) {
            let input = $(`#form-spell-id-${id}`);
            let entry = parseInt($(input).val());

            updateSpellTooltip(id, entry);

            $(`#form-spell-id-${id}`).on('input', function () {
                entry = parseInt($(input).val());
                updateSpellTooltip(id, entry);
            });
        }

        for (let id = 1; id < 6; id++) {
            let trigger = $(`#form-spell-trigger-${id}`);

            $(`#tooltip-spell-trigger-${id}`).text(`${$(trigger).find('option:selected').text()}:`);

            $(`#form-spell-trigger-${id}`).on('input', function () {
                $(`#tooltip-spell-trigger-${id}`).text(`${$(trigger).find('option:selected').text()}:`);
            });
        }

        connection.on("GetSpellInfoCallback", function (response) {
            if (response.success) {
                let id = response.metadata.id;
                let trigger = $(`#form-spell-trigger-${id}`);

                $(`#tooltip-spell-${id}`).show();
                $(`#tooltip-spell-desc-${id}`).text(response.object.description);
            }
            else {
                $(`#tooltip-spell-${elementId}`).hide();
            }
        });
    }
}

// Start SignalR connection.
connection.start().then(function () {
    console.log("SignalR connection established");

    initializeTooltip();
}).catch(function (err) {
    return console.error(err.toString());
});

