import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  successToaster = (message: string) => {
    this.messageService.clear();
    this.showToast(message, 'success', 'Awesome!');
  };

  errorToaster = (message: string) => {
    this.messageService.clear();
    this.showToast(message, 'error', 'Error!');
  };

  warnToaster = (message: string, key: string = '') => {
    this.messageService.clear();
    this.showToast(message, 'warn', 'Sorry!');
  };

  private showToast(detail: string, severity?: string, summary?: string) {
    this.messageService.add({
      detail,
      severity,
      summary,
    });
  }

  async eventHandler(
    message?: string,
    acceptLabel?: string,
    dismissOnOutsideClick?: boolean,
    rejectLabel?: string,
    title?: string
  ) {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: message || 'Are you sure that you want to proceed?',
        header: title || 'Confirmation',
        icon: 'pi pi-info-circle',
        acceptLabel: acceptLabel || 'Yes',
        rejectLabel: rejectLabel || 'No',
        dismissableMask: dismissOnOutsideClick || false,
        acceptIcon: 'none',
        rejectIcon: 'none',
        acceptButtonStyleClass: 'button p-button-success',
        rejectButtonStyleClass: 'button p-button-danger',
        accept: () => {
          resolve('confirmed');
        },
        reject: () => {
          resolve('canceled');
        },
      });
    });
  }
}
