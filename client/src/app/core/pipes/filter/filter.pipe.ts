import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(users: any[], search: string): any[] {
    if (!search) return users;
    const term = search.toLowerCase();
    return users.filter((user) =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(term)
    );
  }
}
