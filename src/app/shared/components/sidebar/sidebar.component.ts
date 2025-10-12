import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, NavbarComponent], // 👈 importante
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen = false;
}
