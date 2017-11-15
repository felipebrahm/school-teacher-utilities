import 'babel-polyfill';
import Cookies from 'js-cookie';

const COOKIE_GROUPS_NUMBER = 'group-generator-groups-number';
const COOKIE_NAMES = 'group-generator-names';

const readAndSetDefaultValuesFromCookie = () => {
  const groupsNumber = Cookies.get(COOKIE_GROUPS_NUMBER);
  if (groupsNumber && groupsNumber >= 1) {
    $('#form-group-generator-groups-number').val(groupNumber);
  }

  const names = Cookies.getJSON(COOKIE_NAMES);
  if (names && names.length > 0) {
    $('#form-group-generator-names').val(names.join('\n'));
  }
};

const randomizeArrayInPlace = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  for (let i = 0; i < arr.length; i += 1) {
    const randomIndex = Math.floor(Math.random() * arr.length);

    // Swap current line with a random one
    const temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
};

const getNamesFromTextArea = () => {
  return ($('#form-group-generator-names').val() || '').trim().split('\n');
};

const getGroupsNumber = () => {
  return parseInt($('#form-group-generator-groups-number').val());
};

$(window).ready(() => {
  readAndSetDefaultValuesFromCookie();

  $('#form-group-generator').submit((e) => {
    e.preventDefault();

    const numberOfGroups = getGroupsNumber();

    if (isNaN(numberOfGroups) || numberOfGroups <= 1) {
      return alert('ERROR: Invalid number of groups. Please enter a valid positive integer larger than 1.');
    }

    const namesByLine = getNamesFromTextArea();

    if (namesByLine.length === 0) {
      return alert(`ERROR: To create ${numberOfGroups} groups you must enter at least ${numberOfGroups} names in different lines.`);
    }

    randomizeArrayInPlace(namesByLine);

    const groups = [];
    let assignToGroupNumber = 0;

    namesByLine.forEach((line) => {
      const names = line.split(';');
      randomizeArrayInPlace(names);

      names.forEach((name) => {
        if (!groups[assignToGroupNumber]) {
          groups[assignToGroupNumber] = [];
        }
        groups[assignToGroupNumber].push(name);
        assignToGroupNumber = (assignToGroupNumber + 1) % numberOfGroups;
      });
    });

    const $results = $('#random-generated-groups-results');
    $results.empty();

    let groupNumber = 0;
    groups.forEach((group) => {
      $results.append(`<div class="col-12 col-sm-6 col-md-3" style="margin-bottom: 20px"><h3>Group ${groupNumber + 1}</h3>${group.join('<br />')}</div>`);

      groupNumber += 1;
    });

    $('#random-generated-groups-results-wrapper').show();

    $('html, body').animate({
      scrollTop: $("#random-generated-groups-results-wrapper").offset().top
    }, 500);

    // Check if we should save values to a cookie
    if ($('#form-group-generator-save-cookie').prop('checked')) {
      Cookies.set(COOKIE_GROUPS_NUMBER, getGroupsNumber(), { expires: 365 });
      Cookies.set(COOKIE_NAMES, getNamesFromTextArea(), { expires: 365 });
    } else {
      Cookies.remove(COOKIE_GROUPS_NUMBER);
      Cookies.remove(COOKIE_NAMES);
    }
  });
});

//# sourceMappingURL=main.js.map
